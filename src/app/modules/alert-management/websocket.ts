import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

export class WebSocketAPI {
    topic:string
    webSocketEndPoint:string
    stompClient: any;
    instance = this
    subscriberComponent: any;
    status : boolean
    constructor(SubscriberComponent, webSocketEndPoint, topic) {
        this.subscriberComponent = SubscriberComponent;
        this.topic = topic;
        this.webSocketEndPoint = webSocketEndPoint
    }
    _connect() {

        let errorCallBack = (error) => {
            setTimeout(() => {
                this.instance._connect();
            }, 5000);
        }
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.status =  true;
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, errorCallBack);
    };

    _disconnect() {
        if (this.stompClient && this.status) {
            this.stompClient.disconnect();
            this.status = false
        }
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        setTimeout(() => {
            this.instance._connect();
        }, 5000);
    }

	/**
	 * Send message to sever via web socket
	 * @param {*} message
	 */
    _send(message) {
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
        if (message && message.body) {
            if(this.subscriberComponent.fromComponent === 'case_batch_upload'){
                this.subscriberComponent.receivedCases(JSON.parse(message.body));
            }else{
                this.subscriberComponent.receivedAlerts(JSON.parse(message.body));
            }
        }
    }
}
