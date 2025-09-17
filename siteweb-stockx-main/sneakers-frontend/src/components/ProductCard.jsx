import React from 'react';
import { Card, CardContent, Typography, CardMedia, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Vérifie si le lien est une vraie image (jpg/png), sinon placeholder
  const imageUrl =
    product.link && (product.link.endsWith('.jpg') || product.link.endsWith('.png'))
      ? product.link
      : '/placeholder.jpg'; // Place ce fichier dans /public

  return (
    <Card sx={{ maxWidth: 345, margin: 'auto' }}>
      <CardActionArea onClick={() => navigate(`/product/${product.id}`)}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={product.name}
          sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
        />
        <CardContent>
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">{product.price}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
