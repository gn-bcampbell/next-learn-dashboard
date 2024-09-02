'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {

    const searchParams = useSearchParams();
    const pathname = usePathname(); //current path "dashboard/invoices"
    const { replace } = useRouter();

    // debounce wraps contents so the code is only run after 300ms to optimise requests
    const handleSearch = useDebouncedCallback((term) => {
        console.log(`Searching... ${term}`);

        // web api util for manipulating URL query parameters
        const params = new URLSearchParams(searchParams);

        if (term){
            params.set('query', term);
        }else{
            params.delete('query');
        }
        // update the url: eg dashboard/invoices?query=lee
        // url is updated without reloading page (client side navigation)
        replace(`${pathname}?${params.toString()}`);
    }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()} //input field stays synced to URL when sharing links
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
