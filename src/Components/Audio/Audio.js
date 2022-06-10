import React from 'react';

class AudioPlayer extends React.Component {
    render() {
        const isSampleAudio = this.props.audio;
        let player;

        if (isSampleAudio !== null) {
            player = <audio src={isSampleAudio} controls />
        } else {
            player = <h3>Sample audio unavaiable</h3>
        }

        return (
            <div className='audio'>
                {player}
            </div>
        );
    }
}

export default AudioPlayer;