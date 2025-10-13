from django.test import TestCase
from .models import Product, Category

class ProductTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(
            name="Laptop", price=999.99, category=self.category, stock=10
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Laptop")
        self.assertEqual(self.product.price, 999.99)
