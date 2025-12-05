import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Country {
  code: string;
  name: string;
  phoneCode: string;
  flag: string;
  region: string;
  ageOfMajority: number;
  nationalIdRequired: boolean;
}

// Comprehensive country database with EAC and global coverage
const COUNTRIES: Country[] = [
  // East African Community
  { code: "TZ", name: "Tanzania", phoneCode: "+255", flag: "🇹🇿", region: "EAC", ageOfMajority: 18, nationalIdRequired: true },
  { code: "KE", name: "Kenya", phoneCode: "+254", flag: "🇰🇪", region: "EAC", ageOfMajority: 18, nationalIdRequired: true },
  { code: "UG", name: "Uganda", phoneCode: "+256", flag: "🇺🇬", region: "EAC", ageOfMajority: 18, nationalIdRequired: true },
  { code: "RW", name: "Rwanda", phoneCode: "+250", flag: "🇷🇼", region: "EAC", ageOfMajority: 16, nationalIdRequired: true },
  { code: "BI", name: "Burundi", phoneCode: "+257", flag: "🇧🇮", region: "EAC", ageOfMajority: 18, nationalIdRequired: true },
  { code: "SS", name: "South Sudan", phoneCode: "+211", flag: "🇸🇸", region: "EAC", ageOfMajority: 18, nationalIdRequired: false },
  { code: "CD", name: "Democratic Republic of Congo", phoneCode: "+243", flag: "🇨🇩", region: "CEPGL", ageOfMajority: 18, nationalIdRequired: true },
  
  // Major Global Countries
  { code: "US", name: "United States", phoneCode: "+1", flag: "🇺🇸", region: "Americas", ageOfMajority: 18, nationalIdRequired: false },
  { code: "GB", name: "United Kingdom", phoneCode: "+44", flag: "🇬🇧", region: "Europe", ageOfMajority: 18, nationalIdRequired: false },
  { code: "CN", name: "China", phoneCode: "+86", flag: "🇨🇳", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "IN", name: "India", phoneCode: "+91", flag: "🇮🇳", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "DE", name: "Germany", phoneCode: "+49", flag: "🇩🇪", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "FR", name: "France", phoneCode: "+33", flag: "🇫🇷", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "JP", name: "Japan", phoneCode: "+81", flag: "🇯🇵", region: "Asia", ageOfMajority: 20, nationalIdRequired: false },
  { code: "BR", name: "Brazil", phoneCode: "+55", flag: "🇧🇷", region: "Americas", ageOfMajority: 18, nationalIdRequired: true },
  { code: "CA", name: "Canada", phoneCode: "+1", flag: "🇨🇦", region: "Americas", ageOfMajority: 18, nationalIdRequired: false },
  { code: "AU", name: "Australia", phoneCode: "+61", flag: "🇦🇺", region: "Oceania", ageOfMajority: 18, nationalIdRequired: false },
  { code: "ZA", name: "South Africa", phoneCode: "+27", flag: "🇿🇦", region: "Africa", ageOfMajority: 18, nationalIdRequired: true },
  { code: "NG", name: "Nigeria", phoneCode: "+234", flag: "🇳🇬", region: "Africa", ageOfMajority: 18, nationalIdRequired: true },
  { code: "EG", name: "Egypt", phoneCode: "+20", flag: "🇪🇬", region: "Africa", ageOfMajority: 18, nationalIdRequired: true },
  { code: "MA", name: "Morocco", phoneCode: "+212", flag: "🇲🇦", region: "Africa", ageOfMajority: 18, nationalIdRequired: true },
  { code: "ET", name: "Ethiopia", phoneCode: "+251", flag: "🇪🇹", region: "Africa", ageOfMajority: 18, nationalIdRequired: true },
  { code: "GH", name: "Ghana", phoneCode: "+233", flag: "🇬🇭", region: "Africa", ageOfMajority: 18, nationalIdRequired: true },
  { code: "IT", name: "Italy", phoneCode: "+39", flag: "🇮🇹", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "ES", name: "Spain", phoneCode: "+34", flag: "🇪🇸", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "NL", name: "Netherlands", phoneCode: "+31", flag: "🇳🇱", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "BE", name: "Belgium", phoneCode: "+32", flag: "🇧🇪", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "CH", name: "Switzerland", phoneCode: "+41", flag: "🇨🇭", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "SE", name: "Sweden", phoneCode: "+46", flag: "🇸🇪", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "NO", name: "Norway", phoneCode: "+47", flag: "🇳🇴", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "DK", name: "Denmark", phoneCode: "+45", flag: "🇩🇰", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "FI", name: "Finland", phoneCode: "+358", flag: "🇫🇮", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "RU", name: "Russia", phoneCode: "+7", flag: "🇷🇺", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "TR", name: "Turkey", phoneCode: "+90", flag: "🇹🇷", region: "Europe", ageOfMajority: 18, nationalIdRequired: true },
  { code: "SA", name: "Saudi Arabia", phoneCode: "+966", flag: "🇸🇦", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "AE", name: "United Arab Emirates", phoneCode: "+971", flag: "🇦🇪", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "IL", name: "Israel", phoneCode: "+972", flag: "🇮🇱", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "SG", name: "Singapore", phoneCode: "+65", flag: "🇸🇬", region: "Asia", ageOfMajority: 21, nationalIdRequired: true },
  { code: "MY", name: "Malaysia", phoneCode: "+60", flag: "🇲🇾", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "TH", name: "Thailand", phoneCode: "+66", flag: "🇹🇭", region: "Asia", ageOfMajority: 20, nationalIdRequired: true },
  { code: "ID", name: "Indonesia", phoneCode: "+62", flag: "🇮🇩", region: "Asia", ageOfMajority: 17, nationalIdRequired: true },
  { code: "PH", name: "Philippines", phoneCode: "+63", flag: "🇵🇭", region: "Asia", ageOfMajority: 18, nationalIdRequired: false },
  { code: "VN", name: "Vietnam", phoneCode: "+84", flag: "🇻🇳", region: "Asia", ageOfMajority: 18, nationalIdRequired: true },
  { code: "KR", name: "South Korea", phoneCode: "+82", flag: "🇰🇷", region: "Asia", ageOfMajority: 19, nationalIdRequired: true },
  { code: "MX", name: "Mexico", phoneCode: "+52", flag: "🇲🇽", region: "Americas", ageOfMajority: 18, nationalIdRequired: true },
  { code: "AR", name: "Argentina", phoneCode: "+54", flag: "🇦🇷", region: "Americas", ageOfMajority: 18, nationalIdRequired: true },
  { code: "CL", name: "Chile", phoneCode: "+56", flag: "🇨🇱", region: "Americas", ageOfMajority: 18, nationalIdRequired: true },
  { code: "CO", name: "Colombia", phoneCode: "+57", flag: "🇨🇴", region: "Americas", ageOfMajority: 18, nationalIdRequired: true },
  { code: "PE", name: "Peru", phoneCode: "+51", flag: "🇵🇪", region: "Americas", ageOfMajority: 18, nationalIdRequired: true },
  { code: "NZ", name: "New Zealand", phoneCode: "+64", flag: "🇳🇿", region: "Oceania", ageOfMajority: 18, nationalIdRequired: false },
];

interface CountrySelectorProps {
  value?: string;
  onValueChange: (country: Country) => void;
  placeholder?: string;
  className?: string;
  showPhoneCode?: boolean;
  showFlag?: boolean;
  showRegion?: boolean;
  prioritizeRegions?: string[];
}

export function CountrySelector({
  value,
  onValueChange,
  placeholder = "Select country...",
  className = "",
  showPhoneCode = false,
  showFlag = true,
  showRegion = false,
  prioritizeRegions = ["EAC", "CEPGL"]
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedCountry = COUNTRIES.find(country => country.code === value);

  // Sort countries with prioritized regions first
  const sortedCountries = [...COUNTRIES].sort((a, b) => {
    const aPriority = prioritizeRegions.includes(a.region) ? 0 : 1;
    const bPriority = prioritizeRegions.includes(b.region) ? 0 : 1;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return a.name.localeCompare(b.name);
  });

  // Filter countries based on search
  const filteredCountries = sortedCountries.filter(country =>
    country.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    country.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    country.phoneCode.includes(searchValue)
  );

  // Group countries by region
  const groupedCountries = filteredCountries.reduce((groups, country) => {
    const region = country.region;
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(country);
    return groups;
  }, {} as Record<string, Country[]>);

  const handleSelect = (country: Country) => {
    onValueChange(country);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              {showFlag && <span className="text-lg">{selectedCountry.flag}</span>}
              <span>{selectedCountry.name}</span>
              {showPhoneCode && (
                <span className="text-muted-foreground text-sm">
                  {selectedCountry.phoneCode}
                </span>
              )}
              {showRegion && (
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {selectedCountry.region}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search countries..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <ScrollArea className="max-h-60">
            <CommandEmpty>No country found.</CommandEmpty>
            {Object.entries(groupedCountries).map(([region, countries]) => (
              <CommandGroup key={region} heading={region}>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={() => handleSelect(country)}
                    className="flex items-center gap-2 py-2"
                  >
                    {showFlag && <span className="text-lg">{country.flag}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{country.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {country.code}
                        {showPhoneCode && ` • ${country.phoneCode}`}
                        {country.region === "EAC" && " • East African Community"}
                        {country.region === "CEPGL" && " • CEPGL Member"}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Phone number input with automatic country code
interface PhoneInputProps {
  value?: string;
  onValueChange: (value: string) => void;
  countryCode?: string;
  onCountryChange: (country: Country) => void;
  placeholder?: string;
  className?: string;
}

export function PhoneInput({
  value,
  onValueChange,
  countryCode,
  onCountryChange,
  placeholder = "Enter phone number",
  className = ""
}: PhoneInputProps) {
  const selectedCountry = COUNTRIES.find(country => country.code === countryCode);

  return (
    <div className="flex gap-2">
      <div className="w-48">
        <CountrySelector
          value={countryCode}
          onValueChange={onCountryChange}
          placeholder="Country"
          showPhoneCode={true}
          showFlag={true}
          className="h-10"
        />
      </div>
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
          {selectedCountry?.phoneCode || "+1"}
        </div>
        <Input
          type="tel"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-16 ${className}`}
        />
      </div>
    </div>
  );
}

// Utility function to get country information
export function getCountryInfo(countryCode: string): Country | undefined {
  return COUNTRIES.find(country => country.code === countryCode);
}

// Utility function to check if user needs national ID based on age and nationality
export function requiresNationalId(countryCode: string, age: number): boolean {
  const country = getCountryInfo(countryCode);
  if (!country) return false;
  
  return country.nationalIdRequired && age >= country.ageOfMajority;
}

// Get age of majority for a country
export function getAgeOfMajority(countryCode: string): number {
  const country = getCountryInfo(countryCode);
  return country?.ageOfMajority || 18;
}

export { COUNTRIES };
export type { Country };