// DOMContentLoaded 이벤트 사용
// => DOM이 완전히 로드된 후에 JS 코드가 실행되도록 보장할 수 있다.

document.addEventListener('DOMContentLoaded', function() {
    // 1. 사용할 DOM 선택하기
    const chatLog = document.getElementById('chat-log'),
        userInput = document.getElementById('user-input'),
        sendButton = document.getElementById('send-button'),
        buttonIcon = document.getElementById('button-icon'),
        info = document.querySelector('.info');

    // 2. 버튼 클릭 시 이벤트 추가하기
    sendButton.addEventListener('click', sendMessage);

    async function sendMessage() {
        // 1. 받아온 값 저장하기 : trim()
        const message = userInput.value.trim();

        // 2. 공백만 입력받았을 때 send 하지 않기
        // 3. 사용자가 입력한 message 화면에 띄우기(container)
        if (message === '') { // message가 비어있다면
            return
        } else {              // message가 비어있지 않다면
            appendMessage('user', message);
            
            const U = "";
            const K = "";
            const options = {
                method : 'POST',
                headers : {
                    'content-type' : 'application/json',
                    Authorization : `Bearer ${K}`, 
                },
                body : JSON.stringify({
                    model : "gpt-3.5-turbo",
                    messages : [{ role: "user", content: message }],
                    max_tokens : 100,
                })
            }
            
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');

            try{
                const response = await fetch(U, options);
                const data = await response.json();
                console.log(data);
                appendMessage('bot', data);
            } catch(error){
                console.error("Error: ", error);
                appendMessage('bot', `Error: ${error}`);
            }
        }
    }

    function appendMessage(sender, message) {
        info.style.display = 'none';

        //사용자&봇의 메세지 전송할 때에는 로딩 아이콘을 사용한다.
        buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');
        buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');

        // 메세지를 담을 Node 생성하기
        const chatElement = document.createElement('div');     // 전체 채팅 박스
        const messageElement = document.createElement('div');  // 채팅 텍스트가 들어갈 박스
        const iconElement = document.createElement('div');     // 사용자/봇 아이콘이 들어갈 박스
        const icon = document.createElement('i');              // 사용자/봇 아이콘 그 자체

        chatElement.classList.add('chat-box');
        iconElement.classList.add('icon');
        messageElement.classList.add(sender);  // 전송자가 사용자인지 봇인지 명시

        messageElement.innerText = message;    // 메세지를 채팅 텍스트에 들어가도록 설정

        if(sender === 'user') { // 사용자일 때
            icon.classList.add('fa-regular', 'fa-user');  // 유저 아이콘 설정
            iconElement.setAttribute('id', 'user-icon');  // 아이디를 #user-icon으로 변경
        } else {                // 봇일 때
            icon.classList.add('fa-solid', 'fa-robot');   // 봇 아이콘 설정
            iconElement.setAttribute('id', 'bot-icon');   // 아이디를 #bot-icon으로 변경
        }

        // 정의한 Node를 트리에 연결
        iconElement.appendChild(icon);              // 아이콘 박스에 icon 추가
        chatElement.appendChild(iconElement);       // 전체 채팅 박스에 아이콘 박스 추가
        chatElement.appendChild(messageElement);    // 전체 채팅 박스에 채팅 텍스트 박스 추가
        chatLog.appendChild(chatElement);           // #chat-log에 전체 채팅 박스 연결 : 화면에 표시하는 기능
    }
}
);