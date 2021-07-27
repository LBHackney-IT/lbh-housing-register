export interface AddressLookupAddress {
  UPRN: number;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  postcode: string;
  town: string;
}

export interface AddressLookupResult {
  address: AddressLookupAddress[];
  page_count: number;
  total_count: number;
}
