let langSetting = 'js/en.json', lang;

function init(){
	dias = lang.day
	meses = lang.month;
	money = lang.money;
	data = new Date();
	diasemana = data.getDay();
	dia = data.getDate();
	mes = parseInt(data.getMonth())+1;
	ano = data.getFullYear();
	hora = data.getHours();
	minuto = data.getMinutes();
	if(localStorage.ultimoid){
		id = localStorage.getItem("ultimoid");
	}else{
		id = 1;
	}
	if(lang.id !== "pt-br")
		traduzGUI();
	recuperaDespesa();
	recuperaCategorias();
	navegacao("abadespesas");
	overwriteForms();
}
function traduzGUI(){
	document.getElementById("despesa").value = lang.menu.expense;
	document.getElementById("lancamento").value = lang.menu.newExpense;
	document.getElementById("config").value = lang.menu.settings;
	document.getElementById("categoriasbtn").value = lang.menu.categories;
	document.getElementById("categoriainput").placeholder = lang.menu.category;
	document.getElementById("resetarbtn").value = lang.menu.reset; 
	document.getElementById("apagarbotao").value = lang.menu.erase;
	document.getElementById("apagarcategoria").value = lang.menu.erase;
}
function overwriteForms(){
	document.getElementById("despesaform").addEventListener("submit", function(event){
		event.preventDefault();
		lancaDespesa();
	});
	document.getElementById("confirmaform").addEventListener("submit", function(event){
		event.preventDefault();
		document.getElementById("confirmabotao").click();
	});
	document.getElementById("categoriaform").addEventListener("submit", function(event){
		event.preventDefault();
		document.getElementById("adicionacategoria").click();
	});
}
function gravaCategorias(click=true){
	if(click){
		if(document.getElementById("categoriainput").value.match(/^[0-9a-zA-Z]+$/)){
			cat = localStorage.getItem("categorias").toLowerCase().split(';');
			v = document.getElementById("categoriainput").value;
			if( cat.indexOf(v.toLowerCase()) != -1 ){
				alerta("show",lang.catExists);
				document.getElementById("categoriainput").value = "";
				return;
			}
			newCat = localStorage.getItem("categorias")+";"+document.getElementById("categoriainput").value;
			localStorage.setItem("categorias",newCat);
		}else{
			alerta("show",lang.invalidData);
			document.getElementById("categoriainput").value = "";
			return;
		}
	}else{
		cat = document.getElementById("categorias").innerText.replace(/\n/g,';').replace(/;$/,'');
		localStorage.setItem("categorias",cat);
	}
	recuperaCategorias();
	document.getElementById("categoriainput").value = "";
}
function removeCategorias(confirmado=false){
	abreConfirma("show", removeCategorias);
	if(confirmado){
		categorias = document.getElementsByName("categoria");
		for(let i = categorias.length-1; i >= 0 ; i--){
			if(categorias[i].checked){
				categorias[i].parentNode.parentNode.remove();
			}
		}
		categorias = document.getElementsByName("categoria");
		gravaCategorias(false);
	}
}
function recuperaCategorias(){
	if(!localStorage.categorias){
		localStorage.setItem("categorias",lang.defaultCat);
	}
	cats = localStorage.getItem("categorias").split(";");
	document.getElementById("categorias").innerHTML = "";
	document.getElementById("local").options.length = 0;
	for(let i=0; i < cats.length; i++){
		if(cats[i].length > 0){
			let option = document.createElement("option");
			option.text = cats[i];
			option.value = cats[i];
			document.getElementById("local").appendChild(option);
			document.getElementById("categorias").innerHTML += "<div class='categoriarow'><label for='categoria_"+cats[i]+"'>"
																											+"<input type='checkbox' name='categoria' id='categoria_"+cats[i]+"' "
																											+"onClick='habilitaApagar(\"categoria\",\"apagarcategoria\")' />"
																											+"<div class='valordia'>"+cats[i]+"</div></label></div>";
		}
	}
	habilitaApagar("categoria","apagarcategoria");
}
function n(n){
    return n > 9 ? "" + n: "0" + n;
}
function lancaDespesa(){
	data = diasemana+";"+n(dia)+"/"+n(mes)+"/"+ano+";"+n(hora)+":"+n(minuto);
	valor = parseFloat(document.getElementById("valor").value).toFixed(2);
	if(valor && !isNaN(valor)){
		local = document.getElementById("local").value;
		localStorage.setItem(id, data+";"+valor+";"+local);
		localStorage.setItem("ultimoid", ++id);
	}else{
		alerta("show",lang.moneyInvalid);
		return;
	}
	document.getElementById("valor").value = "";
	recuperaDespesa();
}
function recuperaDespesa(treina=true){
	let temalguem = false;
	_x = new Array();
	_y = new Array();
	if(id > 1){
		for(i = id-1; i > 0; i--){
			if(localStorage.getItem(i)){
				temalguem = true;
				break;
			}
		}
	}
	if(temalguem){
		document.getElementById("apagardespesa").style.display = "block";
		document.getElementById("conteudodespesas").innerHTML = "";
		valormes = 0;
		valordia = 0;
		ultimomes = "00";
		ultimoano = "0000";
		ultimadata = "00/00/0000";
		for(i = id-1; i > 0; i--){
			if(localStorage.getItem(i)){
				dados = localStorage.getItem(i).split(";");
				splitdata = dados[1].split('/');
				a = splitdata[2];
				m = splitdata[1];
				if(a == ano && m >= mes-3){
					if(localStorage.categorias.split(';').indexOf(dados[4]) != -1){
						_x.push([dados[0],dados[2].split(':')[0],parseFloat(dados[3]).toFixed(2)]);
						_y.push(localStorage.categorias.split(';').indexOf(dados[4]));
					}
				}
				if(a != ultimoano){
					ultimoano = a;
				}
				if(m != ultimomes){
					ultimomes = m;
					if( i != id-1){
						document.getElementById("conteudodespesas").innerHTML += "<br>";
					}
					document.getElementById("conteudodespesas").innerHTML += meses[parseInt(ultimomes)-1]
																												+" <div id='"+ultimomes+ultimoano+"' class='valormes'></div>";
					valormes = 0;
				}

				if(dados[1] != ultimadata){
					ultimadata = dados[1];
					document.getElementById("conteudodespesas").innerHTML += "<div class='data'>"+dias[parseInt(dados[0])]+", "+dados[1]
																												+"<div id='"+dados[1]+"' class='valordia'></div></div>";
					valordia = 0;
				}
				
				valordia += parseFloat(dados[3]);
				valormes += parseFloat(dados[3]);	
				document.getElementById("conteudodespesas").innerHTML += "<div class='despesa'>"
																											+ "<div id='despesacell1'>"
																											+ "<input type='checkbox' name='despesa' value='"+i+"' "
																											+ "onClick='habilitaApagar(\"despesa\",\"apagarbotao\")'></div>"
																											+ "<div id='despesacell2'>"+dados[2]+"</div>"
																											+ "<div id='despesacell3'>"+money+" "+parseFloat(dados[3]).toFixed(2)+"</div>"
																											+ "<div id='despesacell4'>"+dados[4]+"</div></div>";
			document.getElementById(""+ultimomes+ultimoano).innerHTML = money+" "+valormes.toFixed(2);
			document.getElementById(""+dados[1]).innerHTML = money+" "+valordia.toFixed(2);
			}
		}
		habilitaApagar("despesa","apagarbotao");
	}else{
		document.getElementById("conteudodespesas").innerHTML = lang.noneExpanse;
		document.getElementById("apagardespesa").style.display = "none";
	}
}
function alerta(what, msg=""){
	switch(what){
		case "show" :
				document.getElementById("alertamsg").innerHTML = msg;
				document.getElementById("back").style.display = "block";
				document.getElementById("alerta").style.display = "block";
			break;
		case "hide" :
				document.getElementById("back").style.display = "none";
				document.getElementById("alerta").style.display = "none";
			break;
	}
}
function abreConfirma(what, callback){
	switch(what){
		case "show" :
				document.getElementById("back").style.display = "block";
				document.getElementById("confirma").style.display = "block";
				document.getElementById("confirmamsg").innerHTML = lang.confirm;
				document.getElementById("confirmabotao").onclick = function(){
					callback( true );
					abreConfirma('hide');
				};
			break;
		case "hide" :
				document.getElementById("back").style.display = "none";
				document.getElementById("confirma").style.display = "none";
			break;
	}
}
function habilitaApagar(checkbox,botao){
	algumselecionado = false;
	for(i = 0; i < document.getElementsByName(checkbox).length; i++){
		if(document.getElementsByName(checkbox)[i].checked){
			algumselecionado = true;
			break;
		}
	}
	if(!algumselecionado){
		document.getElementById(botao).disabled = true;
	}else{
		document.getElementById(botao).disabled = false;
	}
}
function removeDespesa(confirmado=false){
	abreConfirma("show",removeDespesa);
	if(confirmado){
		let valores = document.getElementsByName("despesa");
		for(i = valores.length-1; i >= 0 ; i--){
			if(valores[i].checked){
				localStorage.removeItem(valores[i].value);
			}
		}
		recuperaDespesa();
	}
}
function navegacao(aba){
	abas = document.getElementsByClassName("aba");
	for(i = 0; i < abas.length; i++){
		abas[i].style.display = "none";
	}
	document.getElementById(aba).style.display = "block";
}

function resetar(confirmado=false){
	abreConfirma("show", resetar);
	if(confirmado){
		localStorage.clear();
		init();
	}
}
function predizCategoria(){
	if(_x && _x.length > 0){
		let textInput = document.getElementById('valor');
		let hora = new Date().getHours();

		let timeout = null;

		clearTimeout(timeout);
		timeout = setTimeout(function () {
		    document.getElementById("local").selectedIndex = previsao([diasemana,hora,textInput.value]);
		}, 500);
	}
}
function previsao(_p,k=3){
	let distancia = [],
			resposta,
			compare,
			r = {},
			resultado,
			_d;
	for(i=0; i < _x.length; i++){
		_d = 0;
		for(j=0; j < _x[i].length; j++){
			_d +=  Math.abs( parseFloat(_p[j]) - parseFloat(_x[i][j]) ); 
		}
		distancia.push( _d );
	}
	resultado = [];
	if(distancia.length >= k*k){
		for(i=0; i < k; i++){
			let iDist = distancia.indexOf(Math.min.apply( null, distancia ));
			resultado.push( _y[iDist] );
			distancia.splice( iDist,1 );
		}
		r = {};
		compare = -1;
		for(i=0; i < k; i++){
			if( !r[resultado[i]] ){
				r[resultado[i]] = 1;
			}else{
				r[resultado[i]] += 1
			}
			if( r[resultado[i]] > compare ){
				compare = r[resultado[i]];
				resposta = resultado[i];
			}
		}
	}else{
		resposta = _y[distancia.indexOf(Math.min.apply( null, distancia ))];
	}
	return resposta;
}
window.onload = () => {
	window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		  window.applicationCache.swapCache();
		  window.location.reload();
    }
  }, false);
	fetch(langSetting)
		.then( response => {
		  response.json().then( result => {
		  	lang = result;
		    init();
		  });
		}).catch( e => console.error( e ) );
};
