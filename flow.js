var line_num = 1;			// 選択肢の位置
var haba_num = 0;			// 選択肢の横の位置
var old_num = line_num;
var old = [];

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

// 質問とボタンを作る
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
		for (let x = haba_num; x < (haba_num + 2); x++) {

			dataArray[y][x] = dataArray[y][x].replace(/\r?\n/g,"");

			if( ( x % 2 ) == 0 ){
				// 質問の文章を表示する
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
				// 選択肢側の解析
				if( dataArray[y][x].trim().length != 0 ){
					data_num++;

					// 選択肢ボタンを設置する
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
							old[ e.target.haba ] = line_num;
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

	// 区切り線を設置する
	if( haba_num != 0 ){
		var text = document.createElement('hr');
		outputElement.appendChild(text);
	}

	// 最初に戻るボタンを作る
	if( btn_flg == 0 ){
		var btn = document.createElement('input');
		// 
		btn.type = "button";
		btn.value = "最初に戻る";
		btn.onclick = function( e ){
			oldElement.textContent = null;
			haba_num = 0;
			line_num = 1;
			outputElement.textContent = null;
			getCsvData('./flow.csv');

		};

		// 生成したdiv要素を追加する
		outputElement.appendChild( btn );			
	}
	// ひとつ戻るボタンを設置
	if( haba_num != 0 ){
		var btn = document.createElement('input');
		// 
		btn.type = "button";
		btn.value = "一つ前の質問に戻る";
		btn.onclick = function( e ){
			oldElement.textContent = null;
			haba_num = haba_num - 2;
			line_num = old[ haba_num ];
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
	old[ 0 ] = line_num;
	getCsvData('./flow.csv');
};
