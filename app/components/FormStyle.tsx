import { ChangeEvent } from "react";

interface FormStyleOptions {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: ({ target }: ChangeEvent<HTMLInputElement>) => void | ((value: string) => void);
    placeholder: string;
    autoComplete: string;
}

export default function FormStyle({ label, type, name, value, onChange, placeholder, autoComplete }: FormStyleOptions) {
    return (
        <div className="animate__animated animate__pulse animate__delay-2s">
            <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"> 
                {label}
            </label>
            <div className="mt-2">
                <div className="flex items-center rounded-md bg-white dark:bg-[#1a1a1b] pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-[#3a393b] has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-purple-600 dark:has-[input:focus-within]:outline-purple-600">
                    {type === "email" ?
                        <div className="shrink-0 text-base text-gray-500 dark:text-gray-400 select-none sm:text-sm/6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-gray-400 dark:text-gray-500 w-5 h-5 me-2">
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                        </div>
                        : ''}
                    {type === "password" ?
                        <div className="shrink-0 text-base text-gray-500 dark:text-gray-400 select-none sm:text-sm/6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock text-gray-400 dark:text-gray-500 w-5 h-5 me-2">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        : ''}
                    <input 
                        type={type} 
                        name={name} 
                        id={name} 
                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-gray-100 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-md bg-transparent" 
                        placeholder={placeholder} 
                        autoComplete={autoComplete} 
                        value={value} 
                        onChange={onChange} 
                    />
                </div>
            </div>
        </div>
    )
}