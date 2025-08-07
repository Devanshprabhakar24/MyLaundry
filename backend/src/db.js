// In-memory data store
export const db = {
    users: [
        {
            id: '1',
            name: 'John Smith',
            email: 'user@example.com',
            password: '123456789', // In a real app, this should be hashed
            role: 'user',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, City, State 12345'
        },
        {
            id: '2',
            name: 'Admin User',
            email: 'admin@mylaundry.com',
            password: '123456789',
            role: 'admin',
            phone: '+1 (555) 987-6543'
        }
    ],
    orders: [
        {
            id: "ORD-001",
            userId: "1",
            status: "washing",
            pickupDate: "2024-01-15",
            estimatedDelivery: "2024-01-16",
            items: ["3kg Wash & Fold", "2 Shirts (Dry Clean)"],
            total: 28.97
        },
        {
            id: "ORD-002",
            userId: "1",
            date: "2024-01-10",
            status: "completed",
            items: ["5kg Wash & Fold"],
            total: 12.50
        },
    ],
    garments: [
        {
            id: "G001",
            userId: "1",
            name: "Blue Business Shirt",
            category: "shirts",
            color: "Blue",
            size: "L",
            material: "Cotton",
            careInstructions: "Dry clean only",
            lastCleaned: "2024-01-10",
            cleanCount: 5,
            condition: "excellent",
            notes: "Starch collar and cuffs"
        },
        {
            id: "G002",
            userId: "1",
            name: "Navy Wool Suit",
            category: "suits",
            color: "Navy",
            size: "42R",
            material: "Wool",
            careInstructions: "Dry clean, press",
            lastCleaned: "2024-01-05",
            cleanCount: 3,
            condition: "good",
            notes: "Handle with care, expensive fabric"
        }
    ]
};