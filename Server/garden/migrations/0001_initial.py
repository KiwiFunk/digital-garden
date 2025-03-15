# Generated by Django 5.1.7 on 2025-03-15 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Plant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('date_planted', models.DateField(auto_now_add=True)),
                ('growth_stage', models.CharField(choices=[('Seed', 'Seed'), ('Sapling', 'Sapling'), ('Blooming', 'Blooming'), ('Fully Grown', 'Fully Grown')], default='Seed', max_length=50)),
                ('notes', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
