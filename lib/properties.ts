import type { Property, PropertyStatus, VariantId } from "@/app/_feelz/data";
import { supabase } from "./supabase";

export type PropertyRow = Property & {
  id: string;
  sort_order: number;
};

export type PropertyInsert = {
  city: string;
  region: string;
  archetype: string;
  status: PropertyStatus;
  stocks: VariantId[];
  sort_order?: number;
};

export type PropertyUpdate = Partial<PropertyInsert>;

const TABLE = "feelz_properties";

function rowToProperty(r: {
  id: string;
  city: string;
  region: string;
  archetype: string | null;
  status: PropertyStatus;
  stocks: string[] | null;
  sort_order: number;
}): PropertyRow {
  return {
    id: r.id,
    city: r.city,
    region: r.region,
    archetype: r.archetype ?? "",
    status: r.status,
    stocks: (r.stocks ?? []) as VariantId[],
    sort_order: r.sort_order,
  };
}

export async function fetchProperties(): Promise<PropertyRow[]> {
  const { data, error } = await supabase()
    .from(TABLE)
    .select("id,city,region,archetype,status,stocks,sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToProperty);
}

export async function createProperty(p: PropertyInsert): Promise<PropertyRow> {
  const { data, error } = await supabase()
    .from(TABLE)
    .insert({
      city: p.city,
      region: p.region,
      archetype: p.archetype,
      status: p.status,
      stocks: p.stocks,
      sort_order: p.sort_order ?? 0,
    })
    .select("id,city,region,archetype,status,stocks,sort_order")
    .single();
  if (error) throw error;
  return rowToProperty(data);
}

export async function updateProperty(
  id: string,
  patch: PropertyUpdate,
): Promise<PropertyRow> {
  const { data, error } = await supabase()
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select("id,city,region,archetype,status,stocks,sort_order")
    .single();
  if (error) throw error;
  return rowToProperty(data);
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase().from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
