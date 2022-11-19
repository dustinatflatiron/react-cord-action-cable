# messages_controller.rb

class MessagesController < ApplicationController
  wrap_parameters :message

  def create
      u = User.find_by(id: session[:user_id])
      message = u.messages.create(message_params)
      channel = Channel.find(message.channel_id)
      ChannelsChannel.broadcast_to(channel, message.as_json(include: :user))
  end

  private
  
  def message_params
      params.require(:message).permit(:content, :channel_id, :user_id, :read)
  end

end