import React from 'react';

class AudioPlayer extends React.Component {
    render() {
        return (
            <div className='audio'>
                <audio src={this.props.audio} controls />
            </div>
        );
    }
}

export default AudioPlayer;