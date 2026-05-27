import { post, get, put, del } from "@/utils/request";

export interface Pet {
  id: number;
  user_id: number;
  name: string;
  type: string;
  breed: string;
  gender: string;
  age: string;
  color: string;
  weight: number;
  size: string;
  neutered: boolean | number;
  vaccinated: string;
  healthCertificate?: boolean;
  health_certificate?: boolean | number;
  personality: string;
  habits: string;
  avatar: string;
  photos: string;
  created_at: string;
  updated_at: string;
}

export interface PetFormData {
  name: string;
  type?: string;
  breed?: string;
  gender?: string;
  age?: string;
  color?: string;
  weight?: number | string;
  size?: string;
  neutered?: boolean;
  vaccinated?: string;
  healthCertificate?: boolean;
  personality?: string;
  habits?: string;
  avatar?: string;
  photos?: string;
}

export async function getPetList(): Promise<Pet[]> {
  const res = await get("/pet/list");
  return res.data;
}

export async function getPetDetail(id: number): Promise<Pet> {
  const res = await get(`/pet/${id}`);
  return res.data;
}

export async function addPet(data: PetFormData): Promise<Pet> {
  const res = await post("/pet", data);
  return res.data;
}

export async function updatePet(
  id: number,
  data: Partial<PetFormData>,
): Promise<Pet> {
  const res = await put(`/pet/${id}`, data);
  return res.data;
}

export async function deletePet(id: number): Promise<void> {
  await del(`/pet/${id}`);
}

export async function uploadPetAvatar(
  filePath: string,
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${import.meta.env.VITE_API_BASE_URL || "https://api.example.com"}/api/pet`,
      filePath,
      name: "avatar",
      header: {
        Authorization: `Bearer ${uni.getStorageSync("token")}`,
      },
      success: (res) => {
        try {
          const result = JSON.parse(res.data);
          if (result.success) {
            resolve({ url: result.data.avatar });
          } else {
            reject(new Error(result.message));
          }
        } catch (e) {
          reject(e);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
