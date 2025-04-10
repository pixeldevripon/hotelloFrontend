export async function createHotel(formData) {
    console.log(`received form data`, formData);

    const result = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel`, {
        method: "POST",
        body: formData,
    });
    const data = await result.json();
    console.log(data);

    return data;
}

