<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrancheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            ['name' => 'INTIA-Douala', 'location' => 'Douala', 'status' => 1],
            ['name' => 'INTIA-Yaoundé', 'location' => 'Yaoundé', 'status' => 1],
        ];

        foreach ($branches as $branch) {
            \App\Models\Branche::create($branch);
        }
    }
}
