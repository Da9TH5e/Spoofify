import { Song } from "@/types";
import { SupabaseClient, useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (song : Song) => {
    const supabaseClient = useSupabaseClient();

    if(!song){
        return null;
    }

    const {data: ImageData} = supabaseClient
    .storage
    .from('images')
    .getPublicUrl(song.image_path);

    return ImageData.publicUrl;
};

export default  useLoadImage;