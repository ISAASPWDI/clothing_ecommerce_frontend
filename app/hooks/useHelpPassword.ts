import { useCallback, useState } from "react";
export interface FormatInitialValues {
    help: string | null;
    password: string;
    copied: boolean;
}

export const useHelpPassword = ( initialValues  : FormatInitialValues) => {
    const [helpPass, setHelpPass] = useState(initialValues);

    // const [password, setPassword] = useState<string>("");
    // const [copied, setCopied] = useState<boolean>(false);
    const handleCopy = (): void => {
        navigator.clipboard.writeText(helpPass.password)
        setHelpPass({
            ...helpPass,
            copied: true
        })
        setTimeout(() => setHelpPass({
            ...helpPass,
            copied: false
        }), 2000)
    }
      const generatePassword = useCallback((): void => {
        const length = 12
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
        let newPassword = ""
        for (let i = 0; i < length; i++) {
          newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setHelpPass(
            {
                ...helpPass,
                password: newPassword,
                copied: false
            }
        )
      }, [helpPass]);
    return {
        ...helpPass,
        helpPass,
        setHelpPass,
        handleCopy,
        generatePassword,
    }
}