/* 여기서도 불변성 쓸 수 있다 */

 const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enable: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    compress: true,
    webpack(config, {webpack}){
        const prod = process.env.NODE_ENV === 'production';
    
        return{
            ...config,
            mode: prod ? 'production': 'development', 
            /* hidden안하면 개발 소스가 다 노출된다 */
             devtool: prod ? 'hidden-source-map' : 'eval',
            plugins: [...config.plugins,
                new webpack.ContextReplacementPlugin(/moment[/\\]locale$/,/^\.\/ko$/)],
                
            
        };
    }
}) 