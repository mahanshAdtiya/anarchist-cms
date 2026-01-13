"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImagePlus, Trash } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: { url: string; id: string }[] | ((prev: { url: string; id: string }[]) => { url: string; id: string }[])) => void;
    onRemove: (value: string) => void;
    value: { url: string; id: string }[];
}


const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const onUpload = (result: any) => {
        onChange((prev) => [
            ...prev,
            { url: result.info.secure_url, id: result.info.secure_url },
        ])
    }
    
    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>
                {value.map((image) => (
                    <div key={image.id} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                        <div className='z-10 absolute top-2 right-2'>
                            <Button type='button' onClick={() => onRemove(image.url)} variant="destructive" size="icon">
                                <Trash className='w-4 h-4'/>
                            </Button>
                        </div>
                        <Image fill className='object-cover' alt='Image' src={image.url} />
                    </div>
                ))}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset='anarchist'>
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button type='button' disabled={disabled} variant={'secondary'} onClick={onClick}>
                            <ImagePlus className='h-4 w-4 mr-2' />
                            Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload