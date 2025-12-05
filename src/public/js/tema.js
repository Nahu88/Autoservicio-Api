// Tema admin panel
document.addEventListener('DOMContentLoaded', () => {
    const btnTheme = document.querySelector('.btn-theme');
    const html = document.documentElement;
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('admin-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateButtonIcon(savedTheme);

    // Toggle tema
    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('admin-theme', newTheme);
            updateButtonIcon(newTheme);
        });
    }
    function updateButtonIcon(theme) {
        if (btnTheme) {
            btnTheme.textContent = theme === 'dark' ? '☀️' : '🌙';
            btnTheme.title = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        }
    }
});
