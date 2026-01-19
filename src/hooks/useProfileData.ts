import { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/api";

export interface PersonalProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "";
  profilePicture: string | null;
}

export interface BusinessProfile {
  businessName: string;
  legalBusinessName: string;
  contactPersonName: string;
  contactPhoneNumber: string;
}

export interface Address {
  id: string;
  type: "business" | "warehouse" | "other";
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface KYCDetails {
  panNumber: string;
  panFile: string | null;
  gstinNumber: string;
  gstinFile: string | null;
}

const STORAGE_KEYS = {
  personal: "vbox_personal_profile",
  business: "vbox_business_profile",
  addresses: "vbox_addresses",
  kyc: "vbox_kyc_details",
};

export function useProfileData() {
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile>({
    firstName: "",
    lastName: "",
    displayName: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [kycDetails, setKycDetails] = useState<KYCDetails>({
    panNumber: "",
    panFile: null,
    gstinNumber: "",
    gstinFile: null,
  });

  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const storedPersonal = localStorage.getItem(STORAGE_KEYS.personal);
      if (storedPersonal) {
        setPersonalProfile(JSON.parse(storedPersonal));
      }

      const storedBusiness = localStorage.getItem(STORAGE_KEYS.business);
      if (storedBusiness) {
        setBusinessProfile(JSON.parse(storedBusiness));
      }

      const storedAddresses = localStorage.getItem(STORAGE_KEYS.addresses);
      if (storedAddresses) {
        setAddresses(JSON.parse(storedAddresses));
      }

      const storedKyc = localStorage.getItem(STORAGE_KEYS.kyc);
      if (storedKyc) {
        setKycDetails(JSON.parse(storedKyc));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }

    setLoading(false);
  }, []);

  const savePersonalProfile = (profile: PersonalProfile) => {
    setPersonalProfile(profile);
    localStorage.setItem(STORAGE_KEYS.personal, JSON.stringify(profile));
  };

  const saveBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    localStorage.setItem(STORAGE_KEYS.business, JSON.stringify(profile));
  };

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem(STORAGE_KEYS.addresses, JSON.stringify(newAddresses));
  };

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    };
    
    // If this is set as default, unset others
    let updatedAddresses = [...addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    
    updatedAddresses.push(newAddress);
    saveAddresses(updatedAddresses);
    return newAddress;
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    let updatedAddresses = addresses.map(addr => 
      addr.id === id ? { ...addr, ...updates } : addr
    );
    
    // If setting as default, unset others
    if (updates.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }));
    }
    
    saveAddresses(updatedAddresses);
  };

  const deleteAddress = (id: string) => {
    saveAddresses(addresses.filter(addr => addr.id !== id));
  };

  const saveKycDetails = (kyc: KYCDetails) => {
    setKycDetails(kyc);
    localStorage.setItem(STORAGE_KEYS.kyc, JSON.stringify(kyc));
  };

  return {
    personalProfile,
    businessProfile,
    addresses,
    kycDetails,
    loading,
    savePersonalProfile,
    saveBusinessProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    saveKycDetails,
  };
}
