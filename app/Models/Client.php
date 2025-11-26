<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'date_of_birth',
        'gender',
        'occupation',
        'branche_id',
        'created_by',
        'updated_by',
        'status',
    ];
    
    protected $with = ['branch'];
    public function branch()
    {
        return $this->belongsTo(Branche::class, 'branche_id');
    }

    public function assurances()
    {
        return $this->hasMany(Assurance::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
