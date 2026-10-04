from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from .predictor import suggest

LOW_CONFIDENCE = 0.5


class SuggestCategoryView(APIView):
    """POST /api/ml/suggest-category/  body: {"text": "my tap is leaking"}"""
    permission_classes = [AllowAny]

    def post(self, request):
        text = (request.data.get("text") or "").strip()
        if len(text) < 3:
            return Response({"detail": "Please enter at least 3 characters."},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(text) > 300:
            text = text[:300]
        suggestions = suggest(text)
        return Response({
            "text": text,
            "suggestions": suggestions,
            "confident": suggestions[0]["confidence"] >= LOW_CONFIDENCE,
        })
