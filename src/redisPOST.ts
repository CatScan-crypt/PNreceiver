export const logBrowserType = async (token: string) => {
    const userAgent = navigator.userAgent;
    let browserType = 'Unknown';
    let browserVersion = 'Unknown';
    
    switch (true) {
        case userAgent.includes('Chrome'):
            browserType = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || 'Unknown';
            break;
        case userAgent.includes('Firefox'):
            browserType = 'Firefox';
            browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
            break;
        case userAgent.includes('Safari'):
            browserType = 'Safari';
            browserVersion = userAgent.match(/Version\/(\d+\.\d+\.\d+)/)?.[1] || 'Unknown';
            break;
        case userAgent.includes('Edge'):
            browserType = 'Edge';
            browserVersion = userAgent.match(/Edge\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || 'Unknown';
            break;
        case userAgent.includes('MSIE'):
        case userAgent.includes('Trident/'):
            browserType = 'Internet Explorer';
            browserVersion = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || 'Unknown';
            break;
    }
    
    console.log('Browser Type :', browserType);
    console.log('Browser Version:', browserVersion);
    console.log('Token:', token);

    try {
        const response = await fetch('/api/browser-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                browserType,
                browserVersion
            })
        });

        if (!response.ok) {
            console.log('Failed to store browser info:');
        }

        const result = await response.json();
        console.log('Browser info stored successfully:', result);
    } catch (error) {
        console.log('Error storing browser info:');
    }

    return { browserType, browserVersion };
};
