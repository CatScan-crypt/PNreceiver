export const logBrowserType = () => {
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
    return { browserType, browserVersion };
};
