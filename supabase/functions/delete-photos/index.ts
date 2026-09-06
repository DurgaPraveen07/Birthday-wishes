// Supabase Edge Function: delete-photos
// Deletes temporary photos for a surprise once the recipient views it completely.

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
    const { surprise_id } = await req.json();

    if (!surprise_id) {
      return new Response(JSON.stringify({ error: "Missing surprise_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Supabase service configuration missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. List files in temp-photos/{surprise_id}
    const { data: files, error: listError } = await supabase.storage
      .from("temp-photos")
      .list(surprise_id);

    if (listError) {
      console.error("List error:", listError);
    }

    if (files && files.length > 0) {
      const pathsToDelete = files.map((file) => `${surprise_id}/${file.name}`);
      const { error: removeError } = await supabase.storage
        .from("temp-photos")
        .remove(pathsToDelete);

      if (removeError) {
        console.error("Remove error:", removeError);
      }
    }

    // 2. Mark photos_deleted = true in surprises table
    const { error: updateError } = await supabase
      .from("surprises")
      .update({ photos_deleted: true })
      .eq("id", surprise_id);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Temporary photos deleted successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
