
(function (d) {
    var params = {
        container: 'ap-news-ticker',
        hostname: 'apnews.com',
        noStyles: true,
        embedId: 'urn:publicid:ap.org:6525b91732b04e0c980e75edf9b57edf'
    };
    var api = d.createElement('script');
    api.type = 'text/javascript';
    api.async = true;
    api.src = 'https://hosted.ap.org/scripts/evergage/latest/api.min.js';
    var done = false;
    api.onload = api.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
            done = true;
            new window.EvergageEmbed(params);
        }
    };
    d.getElementsByTagName('head')[0].appendChild(api);
})(document);
