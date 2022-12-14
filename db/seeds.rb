# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Channel.destroy_all
Message.destroy_all

User.create(full_name: "Test User", username: "test", password:"testing", password_confirmation:"testing", birthday: "01-01-2000")
User.create(full_name: "Test User", username: "test2", password:"testing", password_confirmation:"testing", birthday: "01-01-2000")

Channel.create(name: "Gaming")

3.times do |i|
    Message.create(content: "message #{i}", user_id: User.first.id, channel_id: Channel.first.id)
end