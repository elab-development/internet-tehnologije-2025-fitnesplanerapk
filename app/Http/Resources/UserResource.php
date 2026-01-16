<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ime' => $this->ime,
            'prezime' => $this->prezime,
            'username' => $this->username,
            'mail' => $this->mail,
            'pol' => $this->pol,
            'datumRodjenja' => $this->datumRodjenja,
            'uloga' => $this->uloga->ime ?? null,
            'parametri' => ParametriResource::collection($this->whenLoaded('parametri')),
            'ciljevi' => CiljResource::collection($this->whenLoaded('cilj')),
        ];
    }
}
