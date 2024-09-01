import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type PurchaseFormModel = DeepPartial<{
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  emergencyContact: string;
  passwords: {
    password: string;
    confirmPassword?: string;
  };
  gender: 'male' | 'female' | 'other';
  genderOther: string;
  productId: string;
}>;

export const purchaseFormShape: DeepRequired<PurchaseFormModel> = {
  userId: '',
  firstName: '',
  lastName: '',
  age: 0,
  emergencyContact: '',
  
  passwords: {
    password: '',
    confirmPassword: '',
  },
  gender: 'other',
  genderOther: '',
  productId: '',
};
