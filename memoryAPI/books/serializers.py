from rest_framework import serializers
from .models import Book, Card, MyBook, Bookmark
from accounts.serializers import UserSerializer
 
class CardSerializer(serializers.ModelSerializer):
    book_id = serializers.IntegerField(required=False)
    bookmark_flag = serializers.BooleanField(required=False)
    class Meta:
        model = Card
        fields = ['id', 'word', 'meaning', 'book_id', 'bookmark_flag']

class BookSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, required=False)
    user = UserSerializer(required=False)
    write_flag = serializers.IntegerField(required=False)
    scrap_flag = serializers.BooleanField(required=False)

    class Meta:
        model = Book
        fields = '__all__'

    def create(self, validated_data):
        cards_data = validated_data.pop('cards')
        book = Book.objects.create(**validated_data)
        for card_data in cards_data:
            card_data['book'] = book
            Card.objects.create(**card_data)
        return book

class MyBookSerializer(serializers.ModelSerializer):
    write_flag = serializers.IntegerField(required=False)
    class Meta:
        model = MyBook
        fields = '__all__'
        
class BookmarkSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    class Meta:
        model = Bookmark
        fields = '__all__'


