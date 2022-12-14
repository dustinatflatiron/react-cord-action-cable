class ChannelsChannel < ApplicationCable::Channel

    def receive(data)
        message = Message.create(content: data["content"], channel_id: data["channelId"], user_id: data["userId"])
        channel = Channel.find(message.channel_id)
        ChannelsChannel.broadcast_to(channel, message.as_json(include: :user))
    end

    def subscribed
        puts "subscribed to channels_#{params[:id]}"
        channel = Channel.find(params[:id])
        stream_for channel
        ChannelsChannel.broadcast_to(channel, channel.messages.order(created_at: :desc).as_json(include: :user))
    end

    def unsubscribed 
        puts "unsubscribed HELLO"
        stop_stream_from "channels_#{params[:id]}"
    end

end