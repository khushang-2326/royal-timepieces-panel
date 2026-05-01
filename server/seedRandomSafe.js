import { supabase } from './supabaseClient.js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const watchBrands = [
    { brand: 'Rolex', categories: ['Luxury', 'Sports', 'Diver'] },
    { brand: 'Omega', categories: ['Luxury', 'Sports', 'Chronograph'] },
    { brand: 'Patek Philippe', categories: ['Luxury', 'Dress'] },
    { brand: 'Audemars Piguet', categories: ['Luxury', 'Sports'] },
    { brand: 'Tag Heuer', categories: ['Sports', 'Chronograph'] },
    { brand: 'Seiko', categories: ['Diver', 'Sports', 'Dress'] },
    { brand: 'Cartier', categories: ['Luxury', 'Dress'] },
    { brand: 'Breitling', categories: ['Chronograph', 'Luxury'] },
    { brand: 'IWC', categories: ['Luxury', 'Dress'] },
    { brand: 'Panerai', categories: ['Luxury', 'Diver'] }
];

const candidateImages = [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1508656910606-5b5849890ed1?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1548171915-e76a38210334?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1587836374828-bc86cf0f4d1e?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1585123334904-84521dd9f8e4?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1549972574-87cc7c222ff2?q=80&w=400&fit=crop',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?q=80&w=400&fit=crop'
];

const checkImage = (url) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).on('error', () => resolve(false));
    });
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomWatch = (index, validImages) => {
    const brandObj = getRandomElement(watchBrands);
    const brand = brandObj.brand;
    const category = getRandomElement(brandObj.categories);
    const price = "$" + (Math.floor(Math.random() * 49000) + 1000).toLocaleString();
    const image = validImages[index % validImages.length];

    return {
        name: `${brand} ${category} Model-${index + 1}`,
        brand,
        price,
        category,
        stock: Math.floor(Math.random() * 20),
        image: image,
        description: `This exquisite ${category.toLowerCase()} timepiece from ${brand} features exceptional craftsmanship and premium materials.`
    };
};

const runSeed = async () => {
    try {
        console.log('Testing image URLs for availability...');
        const validImages = [];
        for (const url of candidateImages) {
            const isGood = await checkImage(url);
            if (isGood) {
                validImages.push(url);
            } else {
                console.log(`Failed image: ${url}`);
            }
        }
        
        console.log(`Found ${validImages.length} working images!`);
        
        if (validImages.length === 0) {
            console.error('No valid images found!');
            return;
        }

        console.log('--- Connected to Supabase ---');
        
        const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) throw deleteError;
        console.log(`Removed old products`);
        
        const newProducts = [];
        for (let i = 0; i < 30; i++) {
            newProducts.push(generateRandomWatch(i, validImages));
        }
        
        const { error: insertError } = await supabase.from('products').insert(newProducts);
        if (insertError) throw insertError;
        
        console.log(`Successfully added 30 random watches using ONLY working images.`);

    } catch (err) {
        console.error('Error modifying collection:', err);
    } finally {
        console.log('--- Finished ---');
        process.exit();
    }
};

runSeed();

