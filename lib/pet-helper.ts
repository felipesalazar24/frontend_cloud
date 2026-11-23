export function getPetSpecies(pet: any): "perro" | "gato" | "ave" | "otro" {
  // 1. Si viene el texto directo
  const rawType = String(pet.petType || pet.type || "").toLowerCase();
  if (rawType.includes("perro")) return "perro";
  if (rawType.includes("gato")) return "gato";
  if (rawType.includes("ave") || rawType.includes("pajaro")) return "ave";

  // 2. Si viene por typeId (según tu tabla pet_types)
  const id = Number(pet.typeId);
  if (id >= 1 && id <= 10) return "perro";
  if (id >= 11 && id <= 18) return "gato";
  if (id >= 19 && id <= 24) return "ave";

  return "otro";
}

export function getPetPlaceholder(pet: any): string {
  const species = getPetSpecies(pet);
  return `/placeholders/${species}.png`;
}

export function getPetImage(pet: any): string {
  return pet.imageUrl || pet.photoUrl || getPetPlaceholder(pet);
}