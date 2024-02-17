import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://kwwmsowracytcodkmibp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3d21zb3dyYWN5dGNvZGttaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI5ODEyOTUsImV4cCI6MjAwODU1NzI5NX0.RSmaRbaOO9O1Xu6ip3TE87cnxs7OwLOT2Pz4IpvTJag"
);
