import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Copy, RefreshCcw } from "lucide-react";

interface HelpPasswordOptions {
    help: string | null;
    password: string;
    copied: boolean;
    generatePassword: () => void;
    handleCopy: () => void;
}
    // const [help, setHelp] = useState<string | null>(null);
export default function HelpPassword( { help , password, copied, generatePassword, handleCopy }: HelpPasswordOptions ) {

    return (
        help && <p className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded animate__animated animate__headShake'> {help}
        <Popover>
          <PopoverTrigger
            className="ms-2 cursor-pointer"
            onClick={generatePassword}
          >
            Click aquí
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm break-all">{password}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={generatePassword}>
                  <RefreshCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {copied && <p className="font-medium text-xs text-green-500 mt-2">¡Contraseña copiada!</p>}
          </PopoverContent>
        </Popover>

      </p>
    )
}