export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

export const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

export const getOrderStatusColor = (
    status: string
): { bg: string; text: string } => {
    switch (status) {
        case 'pending':
            return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
        case 'confirmed':
            return { bg: 'bg-blue-100', text: 'text-blue-800' };
        case 'preparing':
            return { bg: 'bg-purple-100', text: 'text-purple-800' };
        case 'on-the-way':
            return { bg: 'bg-indigo-100', text: 'text-indigo-800' };
        case 'delivered':
            return { bg: 'bg-green-100', text: 'text-green-800' };
        case 'cancelled':
            return { bg: 'bg-red-100', text: 'text-red-800' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
