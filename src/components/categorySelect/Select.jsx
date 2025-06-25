import { useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { FaAngleDown } from "react-icons/fa6";
import clsx from 'clsx'
import { categories } from '../../musicCategories';

export default function Select({ value, handleChange, isLightMode }) {
    const [query, setQuery] = useState('')  // combobox search query

    // Filter query
    const filteredPeople = query === '' ? categories : categories.filter((category) => {
        return category.name.toLowerCase().includes(query.toLowerCase());
    })

    // Theme based styling
    const inputBg = isLightMode ? "bg-neutral-100 border-gray-300 border-[1px]" : "bg-[#2a2a2a] border-[#333]";

    // Handle category selection - this receives the category object directly
    const handleCategoryChange = (selectedCategory) => {
        const syntheticEvent = {
            target: {
                name: 'category',
                value: selectedCategory?.name || ''
            }
        };
        handleChange(syntheticEvent);
    };
    // Find the selected category object for display
    const selectedCategory = categories.find(cat => cat.name === value);

    return (
        <div className="w-full mt-2">
            <Combobox name='category' value={selectedCategory} onChange={handleCategoryChange} onClose={() => setQuery('')}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            `disabled:cursor-not-allowed w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg} py-2 px-4`,
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                        )}
                        displayValue={(categories) => categories?.name}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <FaAngleDown />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        `w-(--input-width) rounded-xl border border-white/5 ${inputBg} p-1 [--anchor-gap:--spacing(1)] empty:invisible`,
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                    )}
                >
                    {filteredPeople.map((categories, i) => (
                        <ComboboxOption
                            key={`${categories.name}-${i}`}
                            value={categories}
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <div className={`text-sm/6 ${isLightMode ? 'text-black' : 'text-white'}`}>{categories.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    )
}
