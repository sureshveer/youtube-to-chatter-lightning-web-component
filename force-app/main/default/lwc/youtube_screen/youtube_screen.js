
import { LightningElement,track } from 'lwc';
import searchVideos from '@salesforce/apex/YouTubeController.searchVideos';
import shareOnChatter from '@salesforce/apex/YouTubeController.shareOnChatter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Youtube_screen extends LightningElement {

    //Default search keyword added as 'Lightning Web Component 0to1code'
    @track searchTxt;
    @track result = [];
    @track viewUrl = '';
    @track chatterTxt = '';

  
    doSearch(){
        this.result = [];
        this.viewUrl = '';

        //If search text is not defined then the defaul search will be made using below code.
        if( !this.searchTxt ){
            this.searchTxt = 'Lightning Web Component 0to1code';
        }

        //Getting the timezone from current user's site
        searchVideos({searchString:this.searchTxt})
        .then((result) => {
            this.result = result;
            //Showing first result in the youtube video player.

            if( this.result.length > 0 ){
                this.showVideoInIframe(this.result[0].videoId);
            }
        })
        .catch((error) => {
            let message = error.message || error.body.message;
            this.showMessage( { message: message, messageType: 'error', mode: 'pester'} );
        });
    }

 
    shareOnChatter(){
        if(!this.chatterTxt){
            this.showMessage( { message: 'Message is required to post on chatter.', messageType: 'error', mode: 'pester'} );
            return;
        }
    
        //Getting the timezone from current user's site
        shareOnChatter({chatterText:this.chatterTxt, youTubeUrl: this.viewUrl})
        .then(() => {
            this.showMessage( { message: 'Feed succefully posted...', messageType: 'success', mode: 'pester'} );
            this.chatterTxt = '';
        })
        .catch((error) => {
            let message = error.message || error.body.message;
            this.showMessage( { message: message, messageType: 'error', mode: 'pester'} );
        });
    }

  
    handleFormInput(event){
        if( event.target.name === 'youtube-search' ){
            this.searchTxt = event.target.value;
        }
        else if( event.target.name === 'chatter-txt' ){
            this.chatterTxt = event.target.value;
        }
    }

  
    showVideoInIframe(videoId){
        this.viewUrl = 'https://www.youtube.com/embed/'+videoId;
    }

   
    handleVideoChange(event){
        this.showVideoInIframe(event.detail.videoId);
    }

  
    showMessage( { title, message, messageType, mode }) {
        this.dispatchEvent(new ShowToastEvent({
            mode,
            title,
            message,
            variant: messageType,
        }));
    }

  
    connectedCallback(){
        this.doSearch();
    }
}