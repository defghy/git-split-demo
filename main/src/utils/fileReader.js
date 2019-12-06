import Vue from 'vue';

export const fetchTXT = (url, callBack) => {
  Vue.http.get(url, { responseType: 'text' }).then(res => {
    let { data } = res;
    callBack(data);
  }, err => {
    callBack('');
  });
}

export const fetchPDF = (url, data) => {
	// return Vue.http.post(url, data, { responseType: 'arraybuffer' })
	// 	.then(res => {
	// 		const blob = new Blob([res.blob()], { type: res.headers['content-type'] })
	// 		const filename = (res.headers['Content-Disposition'] || '').split('filename=')[1]
	// 		const result = document.createElement('a')
	// 		result.href = window.URL.createObjectURL(blob)
	// 		result.download = filename || 'invoice.pdf'
	// 		return result
	// 	})
	window.open(`${url}?${data}`)
}