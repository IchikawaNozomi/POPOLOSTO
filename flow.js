var line_num = 1;			// 選択肢の位置
var haba_num = 0;			// 選択肢の横の位置

// CSVの取り込み
function getCsvData(dataPath) {
	const request = new XMLHttpRequest();
	request.addEventListener('load', (event) => {
		const response = event.target.responseText;
		//console.log( response );
		//outputElement.innerHTML = response;
		convertArray(response);
	});
	request.open('GET', dataPath, true);
	request.send();
}

// 
function convertArray(data) {
	var now_num = 0;			// 今の回答の順番
	var data_num = 0;
	var btn_flg = 0;
	var oldElement = document.getElementById('old_str');
	var outputElement = document.getElementById('now_q');
	var oldString = "";
	const dataArray = [];
	const dataString = data.split('\n');


	for (let i = 0; i < dataString.length; i++) {
		dataArray[i] = dataString[i].split(',');
		//console.log( dataArray[i][0] );
	}

	for (let y = 1; y < dataString.length; y++) {
		//for (let x = 0; x < dataArray[y].length; x++) {
		for (let x = haba_num; x < (haba_num + 2); x++) {
			dataArray[y][x] = dataArray[y][x].replace(/\r?\n/g,"");

			//console.log( dataArray[y][x], y, x, now_num, line_num );
			if( ( x % 2 ) == 0 ){
				// 
				if( dataArray[y][x] != "" ){
					now_num++;

					if( line_num == now_num ){
						var text = document.createElement('p');
						// 
						text.innerHTML =  "質問：" + dataArray[y][x];
	 					// 生成したdiv要素を追加する
						outputElement.appendChild(text);

						oldString = dataArray[y][x];
					}
				}
			}else{
				// 
				if( dataArray[y][x].trim().length != 0 ){
					data_num++;
					if( line_num == now_num ){
						console.log( line_num, now_num, dataArray[y][x].trim().length );

						var btn = document.createElement('input');
						// 
						btn.type = "button";
						btn.value = dataArray[y][x];
						btn.data = data_num;
						btn.haba = haba_num;
						btn.oldString = oldString;
						btn.onclick = function( e ){
							console.log( e.target.value, e.target.data );
							haba_num = e.target.haba + 2;
							line_num = e.target.data;
							
							oldElement.textContent = null;
							var text = document.createElement('p');
							text.innerHTML = "前の質問：" + e.target.oldString;
							oldElement.appendChild(text);
							
							
							outputElement.textContent = null;
							getCsvData('./flow.csv');

						};

		 				// 生成したdiv要素を追加する
						outputElement.appendChild( btn );

						btn_flg = 1;
					}
				}				
			}
		}
	}

	var text = document.createElement('p');
	outputElement.appendChild(text);

	// 最初に戻るボタンを作る
	if( btn_flg == 0 ){
		var btn = document.createElement('input');
		// 
		btn.type = "button";
		btn.value = "最初に戻る";
		btn.onclick = function( e ){
			haba_num = 0;
			line_num = 1;
			outputElement.textContent = null;
			getCsvData('./flow.csv');

		};

		// 生成したdiv要素を追加する
		outputElement.appendChild( btn );			
	}
	// 
	if( haba_num != 0 ){
		var btn = document.createElement('input');
		// 
		btn.type = "button";
		btn.value = "一つ前の質問に戻る";
		btn.onclick = function( e ){
			outputElement.textContent = null;
			getCsvData('./flow.csv');

		};

		// 生成したdiv要素を追加する
		outputElement.appendChild( btn );			
	}
}

// ブラウザを立ち上げる
window.onload = function () {
	// ここに読み込み完了時に実行してほしい内容を書く。
	getCsvData('./flow.csv');
};
