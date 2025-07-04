import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"

import { uploadImage } from "@/services/image.service"
import { useState } from "react";
import toast from "react-hot-toast";


export function ImageLinkGenerator() {

    async function getLink(): Promise<void>{
      try{

      if(file != null){

        
        const { imageUrl } = await uploadImage(file);
        setLink(imageUrl);
        toast.success("Upload feito com sucesso");
        return 
      }

      toast.error("Seleciona uma imagem antes de enviar");

      }


      catch(error){

        console.log(error)
        toast.error("Erro ao fazer o upload da imagem, tente novamente");

      }

    }

    const [file, setFile] = useState<File | null>(null);
    const [link, setLink] = useState("");

    return (
      <div className="flex w-full max-w-sm items-center flex-col gap-3 p-4">
          <Label className="flex">Selecione um arquivo e receba o link</Label>

          <div className="flex flex-row py-3">

            <Input
              id="picture"
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) setFile(selectedFile);
              }}
            />

            <Button className="mx-4" onClick={() => {
                getLink();
            }}>Get Link</Button>
          </div>
          <p className="text-xs mt-2 w-full">{link}</p>
      </div>
    )

}