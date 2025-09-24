//Entrada que se envia al backend
export interface CreateUserInput {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    name?: string;
    phone?: string;
    image?: string;
    rol: string;
    authType: string;
}
//Respuesta del backend
export interface CreateUserResponse {
    createUser: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        image: string;
        rol: string;
        authType: string;
        createdAt: string;
        updatedAt: string;
    };
}
interface LoginUserData {
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    image?: string;
    rol: string;
    authType: string;
}
export interface FindUserByEmailData {
    findUserByEmail: LoginUserData;
}
export type Address = {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    address: string;
    optAddress?: string | null;
    city: string;
    zipCode: string;
    phone: string;
}
export interface GetAddressesResponse {
  getAddresses: Address[];
}

export interface AddAddressResponse {
  addAddress: Address;
}
export interface AddAddressVariables {
  input: Omit<Address, "id">;
}

export interface UpdateAddressResponse {
  updateAddress: Address;
}
export interface UpdateAddressVariables {
  id: number;
  input: Omit<Address, "id">;
}

export interface DeleteAddressResponse {
  deleteAddress: boolean;
}
export interface DeleteAddressVariables {
  id: number;
}