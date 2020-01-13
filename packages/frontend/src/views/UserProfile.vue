<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <material-card color="primary" title="Edit Profile" text="Complete your profile">
                    <v-form>
                        <v-container class="py-0">
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field label="Company (disabled)" disabled />
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field color="inverted" label="User Name" />
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field label="Email Address" color="inverted" />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="First Name" color="inverted" />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Last Name" color="inverted" />
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field label="Adress" color="inverted" />
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field label="City" color="inverted" />
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field label="Country" color="inverted" />
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field
                                        color="inverted"
                                        label="Postal Code"
                                        type="number"
                                    />
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea
                                        color="inverted"
                                        label="About Me"
                                        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                    />
                                </v-col>

                                <v-col cols="12" class="text-right">
                                    <v-btn color="success">Update Profile</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </material-card>
            </v-col>
            <v-col cols="12" md="4">
                <material-card class="v-card-profile">
                    <v-avatar slot="offset" class="mx-auto d-block elevation-6" size="130">
                        <img src="//unsplash.it/200/200" style="background-color: white;" />
                    </v-avatar>
                    <v-card-text class="text-center">
                        <h6 class="overline mb-1">1</h6>

                        <h2 class="font-weight-light mb-3">1</h2>

                        <p
                            class="font-weight-light"
                        >Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...</p>

                        <v-btn color="success">Follow</v-btn>
                    </v-card-text>
                </material-card>
            </v-col>
        </v-row>
    </v-container>
</template>
