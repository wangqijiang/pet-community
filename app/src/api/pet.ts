import { post, get, put, del } from "@/utils/request";
import { uploadFileToOss } from "@/api/file";
import { parseJsonArray, normalizePetGender } from "@/utils/format";

export interface Pet {
  id: number;
  user_id: number;
  name: string;
  type: string;
  breed: string;
  gender: string;
  age: number | string;
  color: string;
  weight: number;
  size: string;
  neutered: boolean | number;
  vaccinated: string;
  health_certificate?: boolean | number;
  personality: string;
  habits: string;
  avatar: string;
  photos: string[] | string;
  description?: string;
  owner_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PetFormData {
  name: string;
  type?: string;
  breed?: string;
  gender?: string;
  age?: number | string;
  color?: string;
  weight?: number | string;
  size?: string;
  neutered?: boolean | number;
  vaccinated?: string;
  health_certificate?: boolean | number;
  personality?: string;
  habits?: string;
  avatar?: string;
  photos?: string[] | string;
  description?: string;
}

function normalizePet(pet: Pet): Pet {
  return {
    ...pet,
    gender: normalizePetGender(pet.gender) || pet.gender,
    photos: parseJsonArray<string>(pet.photos),
  };
}

export async function getPetList(): Promise<Pet[]> {
  const res = await get<Pet[]>("/pet/list");
  return (res.data || []).map(normalizePet);
}

export async function getPetDetail(id: number): Promise<Pet> {
  const res = await get<Pet>(`/pet/${id}`);
  return normalizePet(res.data);
}

export async function getPublicPetDetail(id: number): Promise<Pet> {
  const res = await get<Pet>(`/pet/public/${id}`);
  return normalizePet(res.data);
}

export async function getUserPets(
  userId: number,
  page = 1,
  size = 10,
): Promise<{ list: Pet[]; pagination: { total: number; page: number; size: number; pages: number } }> {
  const res = await get<{
    list: Pet[];
    pagination: { total: number; page: number; size: number; pages: number };
  }>(`/pet/user/${userId}`, { page, size });
  return {
    list: (res.data?.list || []).map(normalizePet),
    pagination: res.data?.pagination || { total: 0, page, size, pages: 0 },
  };
}

export async function addPet(data: PetFormData): Promise<Pet> {
  const res = await post<Pet>("/pet", data as Record<string, unknown>);
  return normalizePet(res.data);
}

export async function updatePet(
  id: number,
  data: Partial<PetFormData>,
): Promise<Pet> {
  const res = await put<Pet>(`/pet/${id}`, data as Record<string, unknown>);
  return normalizePet(res.data);
}

export async function deletePet(id: number): Promise<void> {
  await del(`/pet/${id}`);
}

export async function uploadPetAvatar(
  petId: number,
  filePath: string,
): Promise<{ avatar: string }> {
  const url = await uploadFileToOss(filePath);
  const res = await post<{ avatar: string }>(`/pet/${petId}/avatar`, { avatar: url });
  return res.data;
}

export interface PetPersonalityTag {
  id: string;
  label: string;
}

export interface PetFormConfig {
  types: string[];
  typeKeys: Record<string, string>;
  breeds: Record<string, string[]>;
  personalityTags: PetPersonalityTag[];
}

export async function getPetFormConfig(): Promise<PetFormConfig> {
  const res = await get<PetFormConfig>("/pet/config");
  return (
    res.data || {
      types: ["狗狗", "猫咪", "其他"],
      typeKeys: { 狗狗: "dog", 猫咪: "cat", 其他: "other" },
      breeds: {},
      personalityTags: [],
    }
  );
}
