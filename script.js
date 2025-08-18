document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingMessage = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const headersInfo = document.getElementById('headers-info');
    const headersOutput = document.getElementById('headers-output');
    const securityInfo = document.getElementById('security-info');
    const securityReport = document.getElementById('security-report');

    // Lista de cabeceras de seguridad comunes a verificar
    const securityHeaders = [
        'Content-Security-Policy',
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Permissions-Policy'
    ];

    analyzeBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            errorMessage.textContent = 'Por favor, introduce una URL válida.';
            errorMessage.classList.remove('hidden');
            return;
        }

        // Reiniciar estados
        headersInfo.classList.add('hidden');
        securityInfo.classList.add('hidden');
        errorMessage.classList.add('hidden');
        headersOutput.textContent = '';
        securityReport.innerHTML = '';
        loadingMessage.classList.remove('hidden');

        try {
            // Usamos un proxy de CORS público para evitar las restricciones del navegador
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            
            // Obtener todas las cabeceras de la respuesta
            const headers = Object.fromEntries(response.headers.entries());

            // Mostrar todas las cabeceras
            let allHeadersText = '';
            for (const [key, value] of Object.entries(headers)) {
                allHeadersText += `${key}: ${value}\n`;
            }
            headersOutput.textContent = allHeadersText;
            headersInfo.classList.remove('hidden');

            // Analizar cabeceras de seguridad
            securityHeaders.forEach(header => {
                const li = document.createElement('li');
                // Buscamos la cabecera sin distinguir mayúsculas/minúsculas
                const headerFound = Object.keys(headers).find(h => h.toLowerCase() === header.toLowerCase());

                if (headerFound) {
                    li.innerHTML = `<span class="material-icons present">check_circle</span> <b>${header}</b>: <span class="present">Presente</span>`;
                } else {
                    li.innerHTML = `<span class="material-icons missing">cancel</span> <b>${header}</b>: <span class="missing">Faltante</span>`;
                }
                securityReport.appendChild(li);
            });
            securityInfo.classList.remove('hidden');

        } catch (err) {
            errorMessage.textContent = `Error: No se pudo obtener la URL. Asegúrate de que la URL es correcta (ej. https://google.com).`;
            errorMessage.classList.remove('hidden');
            console.error(err);
        } finally {
            loadingMessage.classList.add('hidden');
        }
    });
});
