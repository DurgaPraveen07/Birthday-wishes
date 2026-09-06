// Supabase Edge Function: delete-photos
// Deletes temporary photos for a surprise once viewed, after 2 hours, or abandoned drafts (>1h).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { surprise_id, mode } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Supabase service configuration missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // MODE 1: Delete photos for a specific surprise (viewed to completion)
    if (surprise_id) {
      // 1. Get stored photo paths from DB row first
      const { data: surprise } = await supabase
        .from("surprises")
        .select("photos, type")
        .eq("id", surprise_id)
        .single();

      if (surprise && surprise.photos && surprise.photos.length > 0) {
        const pathsToDelete = surprise.photos.map((p: any) => p.storage_path).filter(Boolean);
        if (pathsToDelete.length > 0) {
          await supabase.storage.from("temp-photos").remove(pathsToDelete);
        }
      }

      // Also list folder directly just in case
      const types = ["birthday", "wedding", "love"];
      for (const t of types) {
        const { data: files } = await supabase.storage.from("temp-photos").list(`${t}/${surprise_id}`);
        if (files && files.length > 0) {
          const paths = files.map((f) => `${t}/${surprise_id}/${f.name}`);
          await supabase.storage.from("temp-photos").remove(paths);
        }
      }

      const { error: updateError } = await supabase
        .from("surprises")
        .update({ photos_deleted: true })
        .eq("id", surprise_id);

      if (updateError) {
        console.error("Update error:", updateError);
      }

      return new Response(
        JSON.stringify({ success: true, message: `Photos for surprise ${surprise_id} deleted` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // MODE 2 & 3: Cleanup photos for 2-hour expired surprises AND 1-hour abandoned drafts
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { data: expiredSurprises, error: queryError } = await supabase
      .from("surprises")
      .select("id, photos")
      .lt("created_at", twoHoursAgo)
      .eq("photos_deleted", false);

    let cleanedCount = 0;
    if (expiredSurprises && expiredSurprises.length > 0) {
      for (const item of expiredSurprises) {
        if (item.photos && item.photos.length > 0) {
          const paths = item.photos.map((p: any) => p.storage_path).filter(Boolean);
          if (paths.length > 0) {
            await supabase.storage.from("temp-photos").remove(paths);
          }
        }

        await supabase
          .from("surprises")
          .update({ photos_deleted: true })
          .eq("id", item.id);

        cleanedCount++;
      }
    }

    // Orphaned Draft Cleanup (folders in temp-photos where no surprise row exists and files > 1h old)
    let orphanedCleaned = 0;
    const oneHourAgoMs = Date.now() - 60 * 60 * 1000;
    const types = ["birthday", "wedding", "love"];

    for (const type of types) {
      const { data: draftFolders } = await supabase.storage.from("temp-photos").list(type);
      if (draftFolders && draftFolders.length > 0) {
        for (const folder of draftFolders) {
          const draftId = folder.name;
          const { data: existingRow } = await supabase
            .from("surprises")
            .select("id")
            .eq("id", draftId)
            .maybeSingle();

          if (!existingRow) {
            // Folder has no DB row; check file timestamps inside
            const { data: draftFiles } = await supabase.storage.from("temp-photos").list(`${type}/${draftId}`);
            if (draftFiles && draftFiles.length > 0) {
              const isOld = draftFiles.some((f) => {
                const createdTime = new Date(f.created_at || Date.now()).getTime();
                return createdTime < oneHourAgoMs;
              });

              if (isOld) {
                const paths = draftFiles.map((f) => `${type}/${draftId}/${f.name}`);
                await supabase.storage.from("temp-photos").remove(paths);
                orphanedCleaned++;
              }
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Photo cleanup completed. Expired surprises cleaned: ${cleanedCount}. Orphaned drafts cleaned: ${orphanedCleaned}.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
