import { Camera, Hotel, MapPin, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { createHotel } from "./actions";

function App() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        image: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Here you would typically send the data to your backend using FormData
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("description", formData.description);
        submitData.append("location", formData.location);
        if (formData.image) {
            submitData.append("image", formData.image);
        }
        console.log(`before submit `, submitData);

        try {
            const result = await createHotel(submitData);
            setIsLoading(false);
            console.log("Hotel created: ", result);
        } catch (error) {
            console.error("Error creating hotel: ", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            console.log(reader);
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                console.log(`file reader result`, reader.result);
                setImagePreview(reader.result);
                console.log(`image preview`, imagePreview);
            };
        }
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-2xl mx-auto'>
                <div className='bg-white rounded-2xl shadow-xl p-8'>
                    <div className='flex items-center gap-3 mb-8'>
                        <Hotel className='h-8 w-8 text-indigo-600' />
                        <h1 className='text-3xl font-bold text-gray-900'>
                            Add New Hotel
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        encType='multipart/formData'
                        className='space-y-6'>
                        <div>
                            <label
                                htmlFor='name'
                                className='block text-sm font-medium text-gray-700 mb-2'>
                                Hotel Name
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    placeholder='Enter hotel name'
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor='description'
                                className='block text-sm font-medium text-gray-700 mb-2'>
                                Description
                            </label>
                            <textarea
                                id='description'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className='block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                placeholder='Describe your hotel'
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='location'
                                className='block text-sm font-medium text-gray-700 mb-2'>
                                <div className='flex items-center gap-2'>
                                    <MapPin className='h-4 w-4 text-gray-500' />
                                    Location
                                </div>
                            </label>
                            <input
                                type='text'
                                id='location'
                                name='location'
                                value={formData.location}
                                onChange={handleChange}
                                className='block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                placeholder='Hotel address'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                <div className='flex items-center gap-2'>
                                    <Camera className='h-4 w-4 text-gray-500' />
                                    Upload Image
                                </div>
                            </label>
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDrop={handleImageDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors duration-200'>
                                <div className='space-y-1 text-center'>
                                    <Upload className='mx-auto h-12 w-12 text-gray-400' />
                                    <div className='flex text-sm text-gray-600'>
                                        <label className='relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
                                            <span>Upload a file</span>
                                            <input
                                                onChange={handleImageChange}
                                                ref={fileInputRef}
                                                type='file'
                                                className='sr-only'
                                                accept='image/*'
                                            />
                                        </label>
                                        <p className='pl-1'>or drag and drop</p>
                                    </div>
                                    <p className='text-xs text-gray-500'>
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {imagePreview && (
                            <div className='mt-4'>
                                <p className='text-sm font-medium text-gray-700 mb-2'>
                                    Preview
                                </p>
                                <div className='relative h-48 rounded-lg overflow-hidden'>
                                    <img
                                        src={imagePreview}
                                        alt='Hotel preview'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                        )}

                        <div className='pt-4'>
                            <button
                                type='submit'
                                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200'>
                                {isLoading ? `Creating...` : `Submit`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;

