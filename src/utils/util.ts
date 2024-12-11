// 添加日期格式化函数
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });
}